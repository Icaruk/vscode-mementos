"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        const context = this;
        // Si hay un timeout en espera, limpiarlo
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Configurar un nuevo timeout
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
exports.debounce = debounce;
;
//# sourceMappingURL=debounce.js.map