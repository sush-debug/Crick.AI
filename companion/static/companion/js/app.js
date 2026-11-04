
document.addEventListener("DOMContentLoaded", () => {

    // 1. Navigation
    const navTabs = document.querySelectorAll(".nav-tab");

    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            navTabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");

            const targetId = tab.getAttribute("data-target");
            const target = document.getElementById(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // 2. Theme Toggle
    const themeToggleBtn = document.getElementById("themeToggleBtn");

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
        });
    }

});
