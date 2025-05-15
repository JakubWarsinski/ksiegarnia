document.addEventListener("DOMContentLoaded", function () {
    const editButton = document.getElementById("edit-button");
    const cancelButton = document.getElementById("cancel-button");
    const form = document.getElementById("user-data-form");
    const view = document.getElementById("user-data-view");

    function showView() {
        form.classList.add("hidden");
        view.classList.remove("hidden");
        form.querySelectorAll(".required").forEach(span => span.classList.add("hidden"));
    }

    function showForm() {
        view.classList.add("hidden");
        form.classList.remove("hidden");
    }

    if (editButton) {
        editButton.addEventListener("click", showForm);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", showView);
    }

    form.addEventListener("submit", function(e) {
        let valid = true;

        form.querySelectorAll("input[data-required='true']").forEach(input => {
            const errorSpan = document.getElementById("err-" + input.name);
            if (!input.value.trim()) {
                valid = false;
                if (errorSpan) errorSpan.classList.remove("hidden");
            } else {
                if (errorSpan) errorSpan.classList.add("hidden");
            }
        });

        if (!valid) {
            e.preventDefault(); 
            const firstErrorInput = form.querySelector("input[data-required='true']:invalid, input[data-required='true']:not(:valid)");
            if (firstErrorInput) firstErrorInput.focus();
        }
    });
});
