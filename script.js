document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const guessInput = document.getElementById('guessInput');
    const submitGuess = document.getElementById('submitGuess');
    const message = document.getElementById('message');
    const attemptCount = document.getElementById('attemptCount');
    const previousAttempts = document.getElementById('previousAttempts');
    const gameResult = document.getElementById('gameResult');
    const playAgain = document.getElementById('playAgain');

    // Sonidos
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const hintSound = document.getElementById('hintSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const startSound = document.getElementById('startSound');

    // Variables del juego
    let magicNumber;
    let attempts;
    let maxAttempts = 10;
    let gameOver = false;
    let guessHistory = [];

    // Inicializar el juego
    function initGame() {
        magicNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 1;
        gameOver = false;
        guessHistory = [];

        // Resetear elementos visuales
        guessInput.disabled = false;
        guessInput.value = '';
        message.textContent = '¡Adivina el número entre 1 y 100!';
        message.className = 'message';
        attemptCount.textContent = `Intento: ${attempts}/${maxAttempts}`;
        previousAttempts.innerHTML = '';
        gameResult.textContent = '';
        gameResult.className = 'game-result';
        playAgain.style.display = 'none';

        // Enfocar el input
        guessInput.focus();

        // Reproducir sonido de inicio
        startSound.play().catch(error => console.log('Error al reproducir sonido: ', error));

        console.log('Número mágico: ', magicNumber); // Para depuración
    }

    // Manejar la conjetura
    function handleGuess() {
        if (gameOver) return;

        const guess = parseInt(guessInput.value);

        // Validar la entrada
        if (isNaN(guess) || guess < 1 || guess > 100) {
            message.textContent = 'Por favor, introduce un número válido entre 1 y 100.';
            hintSound.play().catch(error => {});
            return;
        }

        // Verificar si el número ya fue intentado
        if (guessHistory.includes(guess)) {
            message.textContent = 'Ya has intentado este número. Prueba con otro.';
            hintSound.play().catch(error => {});
            return;
        }

        // Agregar el intento a la historia
        guessHistory.push(guess);

        // Comprobar si el número es correcto
        if (guess === magicNumber) {
            // Victoria
            message.textContent = '¡Felicidades!';
            gameResult.textContent = `¡Has adivinado el número mágico: ${magicNumber}!`;
            gameResult.className = 'game-result win';
            endGame(true);
            correctSound.play().catch(error => {});
        } else {
            // Incorrecto
            const hint = guess < magicNumber ? 'mayor' : 'menor';
            message.textContent = `¡Incorrecto! El número mágico es ${hint} que ${guess}.`;

            // Crear y mostrar el intento en la lista
            const attemptElement = document.createElement('div');
            attemptElement.textContent = guess;
            attemptElement.className = `attempt ${guess < magicNumber ? 'low' : 'high'}`;
            previousAttempts.appendChild(attemptElement);

            // Reproducir sonido de pista
            hintSound.play().catch(error => {});

            // Incrementar el contador de intentos
            attempts++;
            attemptCount.textContent = `Intento: ${attempts}/${maxAttempts}`;

            // Comprobar si se han agotado los intentos
            if (attempts > maxAttempts) {
                message.textContent = '¡Has agotado tus intentos!';
                gameResult.textContent = `El número mágico era ${magicNumber}.`;
                gameResult.className = 'game-result lose';
                endGame(false);
                gameOverSound.play().catch(error => {});
            } else {
                wrongSound.play().catch(error => {});
            }
        }

        // Limpiar el input
        guessInput.value = '';
        guessInput.focus();
    }

    // Finalizar el juego
    function endGame(isWin) {
        gameOver = true;
        guessInput.disabled = true;
        playAgain.style.display = 'block';

        // Añadir efectos visuales según el resultado
        if (isWin) {
            document.querySelector('.arcade-screen').style.boxShadow =
                '0 0 0 4px #222, 0 0 0 6px #111, 0 0 20px rgba(51, 255, 51, 0.8), inset 0 0 20px rgba(51, 255, 51, 0.5)';
        } else {
            document.querySelector('.arcade-screen').style.boxShadow =
                '0 0 0 4px #222, 0 0 0 6px #111, 0 0 20px rgba(255, 51, 51, 0.8), inset 0 0 20px rgba(255, 51, 51, 0.5)';
        }
    }

    // Reiniciar el juego
    function resetGame() {
        // Restaurar el efecto de la pantalla
        document.querySelector('.arcade-screen').style.boxShadow =
            '0 0 0 4px #222, 0 0 0 6px #111, 0 0 20px rgba(255, 51, 255, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.2)';

        // Reiniciar el juego
        initGame();
    }

    // Event listeners
    submitGuess.addEventListener('click', handleGuess);

    guessInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });

    playAgain.addEventListener('click', resetGame);

    // Iniciar el juego al cargar la página
    initGame();

    // Agregar efectos de sonido para los botones
    document.querySelectorAll('.retro-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            hintSound.currentTime = 0;
            hintSound.volume = 0.3;
            hintSound.play().catch(error => {});
        });
    });
});