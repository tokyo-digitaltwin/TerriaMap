# 1. 3D Viewerの構築手順

## 1.1. 前提と事前準備

AWS(Amazon Web Service)を使用します。

作業マシンに下記をインストールして下さい。

- Node.js v10.0 以降
- npm v6.0 以降
- yarn v1.19.0 以降
- awscli（筆者はv2.2.29で動作を確認）

下記のようにAWSのプロファイルを用意してください。このプロファイル名を後述の設定に使用します。

```text
# ~/.aws/config

[profile terria]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

また、AWSの管理コンソールなどで、下記を用意して下さい。

- AWS Route53のHosted Zone
- EC2のキーペア
- AWS SSL Certificate （AWS Certification Managerで作成、またはインポートする）
- アプリケーションパッケージをアップロードするためのAWS S3バケット（アプリケーションのインストールは、作業PCからAWS S3バケットにからパッケージをアップロードし、そのパッケージをEC2インスタンスがダウンロードすることによって行われます。）

## 1.2. 手順

### 1.2.1. TerriaMapのクローン

```bash
git clone -b tokyo-digitaltwin git@github.com:tokyo-digitaltwin/TerriaMap.git
cd TerriaMap
```

### 1.2.2. TerriaJsのクローン

```bash
mkdir packages && cd packages
git clone -b tokyo-digitaltwin git@github.com:tokyo-digitaltwin/terriajs.git
cd ../../
```

### TerriaMap/package.jsonの編集

`TerriaMap/package.json`の`packageName`、`awsProfile`、`awsS3PackagesPath`、`awsRegion`、`awsEc2InstanceType`、`awsEc2ImageId`、`awsKeyName`を変更します。

```json
//変更前
 "config": {
    "packageName": "<PACKAGE NAME>",
    "awsProfile": "<AWS PROFILE>",
    "awsS3PackagesPath": "<YOUR AWS S3 PATH TO STORE YOUR PACKAGE>",
    "awsRegion": "<AWS REGION>",
    "awsEc2InstanceType": "<AWS EC2 INSTANCE TYPE>",
    "awsEc2ImageId": "<AWS EC2 AMI ID UBUNTU>",
    "awsKeyName": "<AWS EC2 KEY PAIR NAME>",
```

各項目の内容は次のとおりです。
| 項目名 | 内容 |
| :-- | :-- |
| packageName | アプリケーションのパッケージ名 |
| awsS3PackagesPath | アプリケーションのパッケージを保管するS3のパス |
| awsRegion | AWS のリージョンID |
| awsEc2InstanceType | EC2のインスタンスタイプ |
| awsEc2ImageId | EC2のAMIのID （Ubuntu 18.04）|
| awsKeyName | EC2のキーペア|

```json
//変更例
 "config": {
    "packageName": "tokyodigitaltwin",
    "awsProfile": "terria",
    "awsS3PackagesPath": "s3://my-great-bucket/viewer",
    "awsRegion": "ap-northeast-1",
    "awsEc2InstanceType": "t3.small",
    "awsEc2ImageId": "ami-00bc9b7f0e98dc134",
    "awsKeyName": "my-great-key-pair",
```

### TerriaMap/deploy/aws/stack.json の編集

`TerriaMap/deploy/aws/stack.json` の `Parameters.HostedZoneName.Default`と`SSLCertificateId`を編集します。

各項目の内容は次のとおりです。
| 項目名 | 内容 |
| :-- | :-- |
| Parameters.HostedZoneName.Default | Route53のHosted Zone |
| SSLCertificateId | AWS SSL CertificateのARN |

### nodejs依存モジュールのインストール

```bash
yarn
```

### インフラ構築とデプロイ

```bash
export NODE_OPTIONS=--max_old_space_size=4096
yarn deploy-without-reinstall
```
