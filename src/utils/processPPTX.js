import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import { setSlides } from "../slices/slidesSlice";

export const processPPTX = async (file, dispatch, add, slides) => {
  const zip = new JSZip();
  const pptxContent = await zip.loadAsync(file);

  // Extract slide files
  const slideFiles = Object.keys(pptxContent.files).filter((fileName) =>
    fileName.startsWith("ppt/slides/slide")
  );

  const newSlides = await Promise.all(
    slideFiles.map(async (slideFile, index) => {
      const slideXml = await pptxContent.files[slideFile].async("string");
      console.log(slideXml);

      // Parse the slide XML (optional, for real content extraction)
      const slideData = await parseStringPromise(slideXml);
      console.log(slideData);

      // For simplicity, use placeholder images for slides
      return {
        id: `ppt-slide-${index + 1}`,
        url: `https://via.placeholder.com/300x200?text=Slide+${index + 1}`,
      };
    })
  );

  console.log(newSlides);

  // Dispatch action to set new slides in Redux
  if (!add) {
    dispatch(setSlides(newSlides));
  } else {
    const updatedSlides = [...slides, ...newSlides];
    dispatch(setSlides(updatedSlides));
  }
};
