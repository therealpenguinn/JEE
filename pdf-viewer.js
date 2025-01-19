const currentPage = document.getElementById("current_page");
const viewer = document.querySelector(".pdf-viewer");
let currentPDF = {};
let zoomTimeout;
let isZooming = false;

document.addEventListener("contextmenu", (event) => event.preventDefault());

function resetCurrentPDF() {
  currentPDF = { file: null, countOfPages: 0, currentPage: 1, zoom: 1.0 };
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js";

function loadPDF(source) {
  const loadingTask = pdfjsLib.getDocument(source);
  resetCurrentPDF();

  loadingTask.promise
    .then((pdfDocument) => {
      currentPDF.file = pdfDocument;
      currentPDF.countOfPages = pdfDocument.numPages;
      viewer.classList.remove("hidden");
      document.querySelector("main h3").classList.add("hidden");
      renderCurrentPage();
    })
    .catch((error) => {
      console.error("Error loading PDF:", error);
      alert("Error loading PDF. Please check the file path and try again.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const file = urlParams.get("file");
  if (file) loadPDF(file);
  else alert("No PDF file selected. Redirecting to home page.");
});

function debounceZoom(callback, delay) {
  if (isZooming) return;
  isZooming = true;
  clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => {
    callback();
    isZooming = false;
  }, delay);
}

document.getElementById("zoomIn").addEventListener("click", () => {
  if (currentPDF.file) {
    debounceZoom(() => {
      currentPDF.zoom = Math.min(currentPDF.zoom + 0.1, 2.0);
      document.getElementById("zoomValue").innerHTML = Math.round(currentPDF.zoom * 100) + "%";
      renderCurrentPage();
    }, 1000); // Half-second delay
  }
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (currentPDF.file) {
    debounceZoom(() => {
      currentPDF.zoom = Math.max(currentPDF.zoom - 0.1, 0.5);
      document.getElementById("zoomValue").innerHTML = Math.round(currentPDF.zoom * 100) + "%";
      renderCurrentPage();
    }, 1000); // Half-second delay
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentPDF.currentPage < currentPDF.countOfPages) {
    currentPDF.currentPage++;
    renderCurrentPage();
  }
});

document.getElementById("previous").addEventListener("click", () => {
  if (currentPDF.currentPage > 1) {
    currentPDF.currentPage--;
    renderCurrentPage();
  }
});

document.addEventListener("keydown", (event) => {
  if (currentPDF.file) {
    if (event.key === "=" || event.key === "+") {
      debounceZoom(() => {
        currentPDF.zoom = Math.min(currentPDF.zoom + 0.1, 2.0);
        document.getElementById("zoomValue").innerHTML = Math.round(currentPDF.zoom * 100) + "%";
        renderCurrentPage();
      }, 1000); // Half-second delay
    } else if (event.key === "-") {
      debounceZoom(() => {
        currentPDF.zoom = Math.max(currentPDF.zoom - 0.1, 0.5);
        document.getElementById("zoomValue").innerHTML = Math.round(currentPDF.zoom * 100) + "%";
        renderCurrentPage();
      }, 1000); // Half-second delay
    }
  }
});

function renderCurrentPage() {
  currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
    const context = viewer.getContext("2d");
    const viewport = page.getViewport({ scale: currentPDF.zoom });
    viewer.height = viewport.height;
    viewer.width = viewport.width;

    const renderContext = { canvasContext: context, viewport: viewport };
    page.render(renderContext);
  });
  currentPage.innerHTML = `${currentPDF.currentPage} of ${currentPDF.countOfPages}`;
}
