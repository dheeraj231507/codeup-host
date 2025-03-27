import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { setAdd, setSlides } from "../slices/slidesSlice";

// Process PDF: Render pages as images
export const processPDF = async (file, dispatch, add, slides) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  const newSlides = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for better resolution
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to image URL
    newSlides.push({
      id: `pdf-page-${i}`,
      url: imageUrl,
    });
  }

  // Dispatch action to set new slides in Redux
  // Removed dispatch from here

  // Dispatch action to set new slides in Redux
  if (!add) {
    dispatch(setSlides(newSlides));
  } else {
    const updatedSlides = [...slides, ...newSlides];
    dispatch(setSlides(updatedSlides));
  }
};
