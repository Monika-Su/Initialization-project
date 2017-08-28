<?php
header("Content-Type:application/json");
$output = [];
@$id = @$_REQUEST['id'];
if(empty($id))
{
    echo '[]';
    return;
}
$conn = mysqli_connect('127.0.0.1','root','','products');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);

$sql = "SELECT oid,time,pic,detail FROM news WHERE oid=$id";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if(empty($row))
{
    echo '[]';
}
else
{
    $output[] = $row;
    echo json_encode($output);
}
?>