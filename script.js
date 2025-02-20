document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const languageSwitcher = document.getElementById("language-switcher");
    const title = document.getElementById("title");
    const outputTitle = document.getElementById("output-title");
    const compileButton = document.getElementById("compile");
    const output = document.getElementById("output");

    let editor;

    // Инициализация Monaco Editor
    require.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.33.0/min/vs" } });
    require(["vs/editor/editor.main"], () => {
        editor = monaco.editor.create(document.getElementById("editor"), {
            value: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`,
            language: "csharp",
            theme: body.dataset.theme === "dark" ? "vs-dark" : "vs",
            automaticLayout: true,
            fontSize: 16,
            minimap: { enabled: false }
        });
    });

    // Переключение темы
    themeToggle.addEventListener("click", () => {
        const isDark = body.dataset.theme === "dark";
        body.dataset.theme = isDark ? "light" : "dark";
        monaco.editor.setTheme(isDark ? "vs" : "vs-dark");
        themeToggle.textContent = isDark ? "🌙" : "☀️";
    });

    // Переключение языка
    languageSwitcher.addEventListener("change", () => {
        const lang = languageSwitcher.value;
        if (lang === "ru") {
            title.textContent = "Онлайн компилятор C#";
            compileButton.textContent = "Скомпилировать";
            outputTitle.textContent = "Результат:";
        } else {
            title.textContent = "Online C# Compiler";
            compileButton.textContent = "Compile";
            outputTitle.textContent = "Output:";
        }
    });

    // Компиляция кода с использованием glot.io
    compileButton.addEventListener("click", async () => {
        const code = editor.getValue();

        if (!code.trim()) {
            output.textContent = languageSwitcher.value === "ru"
                ? "Пожалуйста, введите код для компиляции."
                : "Please enter code to compile.";
            return;
        }

        output.textContent = languageSwitcher.value === "ru" ? "Компиляция..." : "Compiling...";

        try {
            const response = await fetch("https://glot.io/api/run/csharp/latest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token 4b0b3b1a-6d3e-4b0e-a7a1-7e890b60d5b2"
                },
                body: JSON.stringify({
                    files: [{ name: "main.cs", content: code }]
                })
            });

            if (!response.ok) {
                throw new Error(languageSwitcher.value === "ru" ? "Ошибка сервера." : "Server error.");
            }

            const result = await response.json();

            output.textContent = result.stderr ? `Ошибка: ${result.stderr}` : result.stdout;
        } catch (error) {
            output.textContent = languageSwitcher.value === "ru"
                ? `Ошибка: ${error.message}`
                : `Error: ${error.message}`;
        }
    });
});
