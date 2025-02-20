document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Переключение темы
    themeToggle.addEventListener('click', () => {
        body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Компиляция кода
    const compileButton = document.getElementById('compile');
    const codeInput = document.getElementById('code');
    const output = document.getElementById('output');

    compileButton.addEventListener('click', async () => {
        const code = codeInput.value;

        if (!code.trim()) {
            output.textContent = 'Пожалуйста, введите код для компиляции.';
            return;
        }

        output.textContent = 'Компиляция...';

        try {
            // Используем API .NET Fiddle для компиляции
            const response = await fetch('https://dotnetfiddle.net/api/compiler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Language: 'csharp',
                    Code: code,
                    Compiler: 'dotnet',
                    ProjectType: 'console',
                }),
            });

            const result = await response.json();

            if (result.Errors) {
                output.textContent = result.Errors.join('\n');
            } else {
                output.textContent = result.Output;
            }
        } catch (error) {
            output.textContent = 'Ошибка при компиляции: ' + error.message;
        }
    });
});
