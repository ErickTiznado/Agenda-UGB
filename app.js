document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Función para manejar el inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('emailLogin').value;
        const contraseña = document.getElementById('contraseñaLogin').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, contraseña })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // Aquí puedes redirigir al usuario a su dashboard, por ejemplo.
                // window.location.href = "/dashboard";
            } else {
                alert('Error al iniciar sesión.');
            }
        } catch (error) {
            console.error("Hubo un error al hacer la solicitud:", error);
        }
    });

    // Función para manejar el registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreRegistro').value;
        const email = document.getElementById('emailRegistro').value;
        const contraseña = document.getElementById('contraseñaRegistro').value;

        try {
            const response = await fetch('/estudiante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, contraseña })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // Aquí puedes redirigir al usuario a la página de inicio de sesión, por ejemplo.
                // window.location.href = "/login";
            } else {
                alert('Error al registrarse.');
            }
        } catch (error) {
            console.error("Hubo un error al hacer la solicitud:", error);
        }
    });

    // Aquí puedes agregar más funciones y event listeners para otras interacciones en tu aplicación.
});
