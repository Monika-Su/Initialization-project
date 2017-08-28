<?php
header("Content-Type:application/json");
$output = [];
$count = 4; //一次最多查询 5 条
@$start = $_REQUEST['start'];
if(empty($start)) {
    $start = 0; //默认从 0 开始
 }
$conn = mysqli_connect('127.0.0.1','root','','products');
$sql = 'SET NAMES UTF8';
mysqli_query($conn,$sql);
# $sql = "SELECT COUNT(*) FROM maobi";
#$result1=mysqli_query(&conn,$sql);
#$n=intavl($result1["COUNT(*)"]);
#$pagetotal=ceil($n/$count);
$sql = "SELECT*FROM maobi LIMIT  $start,$count";
$result = mysqli_query($conn,$sql);
while( true ){
     //从结果集中读取一行记录
     $row = mysqli_fetch_assoc($result);
     if(! $row ){  //没有获取到更多记录行
         break;
     }
     $output[] = $row;
 }
 # $output[] = $pagetotal;
  echo json_encode($output);
  ?>