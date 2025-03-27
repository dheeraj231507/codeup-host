import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openDB } from "idb";
import { resetPoll, setPoll } from "./pollSlice";

const dbPromise = openDB("slidesDB", 1, {
  upgrade(db) {
    db.createObjectStore("slides", { keyPath: "id" });
  },
});

export const saveSlides = createAsyncThunk(
  "slides/saveSlides",
  async ({ slides, poll, showName, dispatch }) => {
    try {
      const db = await dbPromise;
      const allSlides = await db.getAll("slides");
      console.log("All slides:", allSlides); // Log all slides to check their IDs
      const newId =
        allSlides.length > 0
          ? Math.max(
              ...allSlides
                .map((slide) => slide.id)
                .filter((id) => typeof id === "number")
            ) + 1
          : 1;

      console.log("Saving slides with ID:", newId, {
        id: newId,
        slides,
        poll,
        showName,
      });
      await db.put("slides", { id: newId, slides, poll, showName });

      dispatch(resetSlides());
      dispatch(resetPoll());
    } catch (error) {
      console.error("Failed to save slides and poll:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
);

export const loadSlides = createAsyncThunk(
  "slides/loadSlides",
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI; // Extract dispatch from thunkAPI
    const db = await dbPromise;
    const data = await db.getAll("slides");

    // Dispatch setPoll to update the poll state
    if (data && data.poll) {
      dispatch(setPoll(data.poll)); // Use dispatch to update poll state
    }

    return data; // Return the data to be used in the fulfilled case
  }
);

export const deleteSlide = createAsyncThunk(
  "slides/deleteSlide",
  async (id) => {
    const db = await dbPromise;
    await db.delete("slides", id);
    const allSlides = await db.getAll("slides");

    // Rearranging IDs
    for (let i = 0; i < allSlides.length; i++) {
      allSlides[i].id = i + 1; // Reassign IDs starting from 1
      await db.put("slides", allSlides[i]); // Update each slide with new ID
    }
  }
);

const slidesSlice = createSlice({
  name: "slides",
  initialState: {
    slides: [],
    loading: false,
    add: false,
    showName: "",
  },
  reducers: {
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdd: (state, action) => {
      state.add = action.payload;
    },
    setShowName: (state, action) => {
      state.showName = action.payload;
    },
    resetSlides: (state) => {
      state.slides = [];
      state.loading = false;
      state.add = false;
      state.showName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSlides.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadSlides.fulfilled, (state, action) => {
        state.slides = action.payload.slides;
        state.add = action.payload.add;
        state.showName = action.payload.showName;
        // The poll state is already updated in the loadSlides thunk
      })
      .addCase(deleteSlide.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { setSlides, setLoading, setAdd, setShowName, resetSlides } =
  slidesSlice.actions;
export default slidesSlice.reducer;
