<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Nube Privada</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <?php if (!isset($_SESSION['admin'])): ?>
        <div class="login-container">
            <form method="POST">
                <h2>Acceso</h2>
                <input type="text" name="user" placeholder="Admin">
                <input type="password" name="pass" placeholder="Password">
                <button type="submit" name="login">Entrar</button>
                <p><?= $mensaje ?></p>
            </form>
        </div>

    <?php else: ?>
        <header>
            <h1>☁️ Mi Nube</h1>
            <a href="?logout">Cerrar Sesión</a>
        </header>

        <section class="upload">
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="archivo">
                <button type="submit">Subir</button>
            </form>
        </section>

        <ul class="file-list">
            <?php foreach ($lista_archivos as $archivo): ?>
                <li>
                    <span><?= $archivo ?></span>
                    <div class="actions">
                        <a href="uploads/<?= $archivo ?>" download>Descargar</a>
                        <a href="?eliminar=<?= $archivo ?>" class="delete">Eliminar</a>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

</body>
</html>