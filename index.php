<?php
session_start();
include('config.php');

$upload_dir = "uploads/";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);


$mensaje = "";

// Login
if (isset($_POST['login'])) {
    if ($_POST['user'] === $admin_user && $_POST['pass'] === $admin_pass) {
        $_SESSION['admin'] = true;
    } else {
        $mensaje = "Error: Datos incorrectos.";
    }
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}

// Subida de archivos
if (isset($_SESSION['admin']) && isset($_FILES['archivo'])) {
    move_uploaded_file($_FILES['archivo']['tmp_name'], $upload_dir . $_FILES['archivo']['name']);
}

// Eliminar
if (isset($_SESSION['admin']) && isset($_GET['eliminar'])) {
    unlink($upload_dir . basename($_GET['eliminar']));
    header("Location: index.php");
    exit;
}

// Preparar lista de archivos para la vista
$lista_archivos = array_diff(scandir($upload_dir), array('.', '..'));

// CARGAR LA VISTA
include('dashboard.view.php');