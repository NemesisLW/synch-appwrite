import { ID, databases, storage } from "@/appwrite";
import { getGroupedTodos } from "@/lib/groupedTodos";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateDB: (todo: Todo, columnId: TypedColumn) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  newTask: string;
  newTaskType: TypedColumn;
  setNewTask: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  newTask: "",
  newTaskType: "todo",
  image: null,

  getBoard: async () => {
    const board = await getGroupedTodos();
    set({ board });
  },

  setBoardState: (board) => set({ board }),
  async updateDB(todo, columnId) {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },

  async deleteTask(taskIndex, todo, id) {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    // images
    if (todo?.image) {
      await storage.deleteFile(todo.image?.bucketId, todo.image?.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTask(input: string) {
    set({ newTask: input });
  },
  setNewTaskType(columnId: TypedColumn) {
    set({ newTaskType: columnId });
  },

  async addTask(todo, columnId, image?) {
    let file: null | Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = { bucketId: fileUploaded.bucketId, fileId: fileUploaded.$id };
      }

      const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title: todo,
          status: columnId,
          ...(file && { image: JSON.stringify(file) }),
        }
      );

      set({ newTask: "" });

      set((state) => {
        const newColumns = new Map(state.board.columns);
        const newTodo: Todo = {
          $id,
          $createdAt: new Date().toISOString(),
          title: todo,
          status: columnId,
          ...(file && { image: file }),
        };

        const column = newColumns.get(columnId);

        if (!column) {
          newColumns.set(columnId, { id: columnId, todos: [newTodo] });
        } else {
          newColumns.get(columnId)?.todos.push(newTodo);
        }

        return { board: { columns: newColumns } };
      });
    }
  },

  setImage(image: File | null) {
    set({ image });
  },
}));
