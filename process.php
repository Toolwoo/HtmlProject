
<html>
    <head>
        <title>Comment </title>
        <link rel="stylesheet" href="style.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
        <body>
          <header>
        <div class="header-content">
            <h1>🏆 BUAH TEMPATAN 🏆</h1>
        </div>
    </header>

    <!-- Navigation Menu -->
    <nav>
        <div class="nav-container">
            <a href="index.html" class="nav-logo">
                <img src="llogo.jpg" alt="Logo">
            </a>
            <a href="redirects/durian.html" class="nav-link">Durian</a>
            <a href="redirects/manggis.html" class="nav-link">Manggis</a>
            <a href="redirects/pisang.html" class="nav-link">Pisang</a>
            <a href="redirects/belimbing.html" class="nav-link">Belimbing</a>
        </div>
    </nav>

            <main>
               <?php
$servername = "localhost";
$username = "root";   // change if needed
$password = "";       // change if needed
$dbname = "buah_tempatan";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$nama = $_POST['nama'];
$komen = $_POST['komen'];

$sql = "INSERT INTO komen (nama, komen) VALUES ('$nama', '$komen')";

if ($conn->query($sql) === TRUE) {
  echo "Komen berjaya disimpan! 🎉 <a href='index.html'>Balik</a>";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
            </main>
        </body>
</html>
