import * as bootstrap from 'bootstrap';
export async function initToolTips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    // console.log("tooltipTriggerList => ", tooltipTriggerList);
    const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl, {
            delay: { "show": 100, "hide": 100 },
            trigger: "hover",
        });
    });
}
