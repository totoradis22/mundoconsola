// ==========================================
// MUNDOCONSOLA - SCRIPT DE FILTRADO Y BÚSQUEDA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-box input");
    const categorySelect = document.querySelector(".category-select");
    const productCards = document.querySelectorAll(".product-card");

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedCategory = categorySelect ? categorySelect.value.toLowerCase().trim() : "todas las categorías";

        productCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const description = card.querySelector("p").textContent.toLowerCase();
            
            // Coincidencia de búsqueda por texto
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

            // Coincidencia exacta por categoría seleccionada
            let matchesCategory = true;
            if (selectedCategory !== "todas las categorías" && selectedCategory !== "todas las categorias") {
                if (selectedCategory.includes("consolas")) {
                    matchesCategory = title.includes("xbox") || title.includes("playstation") || title.includes("nintendo") || title.includes("consola");
                } else if (selectedCategory.includes("controles")) {
                    matchesCategory = title.includes("control") || title.includes("dualsense");
                } else if (selectedCategory.includes("accesorios")) {
                    matchesCategory = title.includes("audífono") || title.includes("audifonos") || title.includes("teclado") || title.includes("silla") || title.includes("escritorio") || title.includes("micrófono");
                }
            }

            // Mostrar u ocultar tarjeta según los filtros
            if (matchesSearch && matchesCategory) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Escuchar eventos de búsqueda y selección
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", filterProducts);
    }
});