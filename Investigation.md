## CSS Architecture Investigation Summary

**Conclusion:** The project's styling is broken due to a fundamental conflict between globally-scoped CSS files and the Tailwind CSS utility-first framework. Styles intended for the home page are "leaking" and affecting every other page, creating unpredictable overrides and preventing Tailwind from working as expected.

---

### The Core Problem: Global CSS Overrides

1.  **Global Import of `home.css`:** The file `src/app/page.tsx` (the home page) contains the line `import "./home.css";`. In Next.js, importing a CSS file in this way makes its styles **global**. This means every single style defined in `home.css` is loaded on every single page of your application, not just the home page.

2.  **Conflicting Generic Selectors:** The `home.css` file is full of generic, non-specific class names and element selectors. The most critical example is the `.btn` class:

    ```css
    /* From home.css */
    .btn {
      background-color: #2bd97c; /* A green color */
      color: #032b41; /* A dark blue color */
      /* ... other styles */
    }
    ```

3.  **The Cascade Collision:** On the `/library` page, the login button has `className="btn bg-[#2bd97c] text-white ..."`. Here's what happens:
    *   The browser sees the `.btn` class and applies the `background-color: #2bd97c` and `color: #032b41` rules from the global `home.css` file.
    *   It then sees the Tailwind utility classes `bg-[#2bd97c]` and `text-white`.
    *   Due to the complexities of CSS specificity and the order in which stylesheets are loaded and processed (the "cascade"), the browser is getting confused. In this case, the `color: #032b41` from the global `.btn` class is winning the specificity war against Tailwind's `text-white` utility, which is why the button text is dark blue instead of white.
    *   The reason the green background *sometimes* appears is likely due to a fragile and unpredictable race condition in the build process, not because it's working correctly.

### The Tangled Mess: `globals.css` vs. `home.css`

The problem is even deeper. The project has **two** competing global stylesheets with conflicting definitions:

*   **`globals.css`:** This file defines `.btn-primary` with a dark blue background.
*   **`home.css`:** This file defines `.btn` with a green background.

This creates a chaotic and unpredictable environment where the final appearance of an element depends on a fragile combination of which classes are present and how the browser decides to resolve the conflicts. This is the definition of a "tangled mess" and is the primary reason for the inconsistent styling throughout the project.

### How to Fix This (The Strategy)

To fix this, the styles for the home page must be **scoped** so they only apply to the home page and cannot leak into other parts of the application. The correct, modern way to do this in Next.js is to use **CSS Modules**.

1.  **Rename `home.css`:** The file should be renamed to `home.module.css`.
2.  **Update the Import:** In `src/app/page.tsx`, the import statement must be changed from `import "./home.css";` to `import styles from "./home.module.css";`.
3.  **Update Class Names:** Every class name on the home page would then need to be updated to use the `styles` object (e.g., `className="btn"` becomes `className={styles.btn}`).

By taking these steps, Next.js will automatically transform the class names in `home.module.css` into unique, non-conflicting class names (e.g., `.home_btn__1a2b3c`). This completely isolates the home page's styling and guarantees that it can never conflict with Tailwind or any other CSS file in the project, untangling the mess and allowing Tailwind to function as the primary, predictable styling engine for the rest of the application.
