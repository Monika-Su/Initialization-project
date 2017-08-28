<?php
header("Content-Type:application/json");
$output = [];
@$kw = @$_REQUEST['kw'];
if(empty($kw))
{
    echo '[]';
    return;
}

$conn = mysqli_connect('127.0.0.1','root','','products');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);

$sql = "SELECT did,img_sm,material,detail,detail_1,price FROM maobi WHERE detail LIKE '%$kw%' OR material LIKE '%$kw%' OR detail_1 LIKE '%$kw%'";
#like实现模糊查询，%+变量内容%默认匹配相关文字。
$result = mysqli_query($conn,$sql);

while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }

    $output[] = $row;
}

echo json_encode($output);

?>