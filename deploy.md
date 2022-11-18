# 1. 3D Viewer の構築手順

## 1.1. 前提と事前準備

AWS(Amazon Web Service)を使用します。

作業マシンに下記をインストールして下さい。

- Node.js v14.0 以降
- npm v6.0 以降
- yarn v1.19.0 以降
- awscli（筆者は v2.2.29 で動作を確認）

下記のように AWS のプロファイルを用意してください。このプロファイル名を後述の設定に使用します。

```text
# ~/.aws/config

[profile terria]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

また、AWS の管理コンソールなどで、下記を用意して下さい。

- AWS Route53 の Hosted Zone
- EC2 のキーペア
- AWS SSL Certificate （AWS Certification Manager で作成、またはインポートする）
- アプリケーションパッケージをアップロードするための AWS S3 バケット（アプリケーションのインストールは、作業 PC から AWS S3 バケットにからパッケージをアップロードし、そのパッケージを EC2 インスタンスがダウンロードすることによって行われます。）

## 1.2. 手順

### 1.2.1. TerriaMap のクローン

```bash
git clone -b tokyo-digitaltwin git@github.com:tokyo-digitaltwin/TerriaMap.git
cd TerriaMap
```

### 1.2.2. TerriaJs のクローン

```bash
mkdir packages && cd packages
git clone -b tokyo-digitaltwin git@github.com:tokyo-digitaltwin/terriajs.git
cd ../../
```

### 1.2.3. terriajs-cesium のクローン

```bash
cd packages
git clone -b tokyo-digitaltwin git@github.com:tokyo-digitaltwin/cesium.git
cd ../../
```

### 1.2.4. TerriaMap/package.json の編集

`TerriaMap/package.json`の`packageName`、`awsProfile`、`awsS3PackagesPath`、`awsRegion`、`awsEc2InstanceType`、`awsEc2ImageId`、`awsKeyName`を変更します。

```json
//変更前
 "config": {
    "packageName": "<PACKAGE NAME>",
    "stackName": "<STACK NAME>",
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
| stackName | AWS CloudFormation スタック名 |
| awsProfile | AWS のプロファイル名 |
| awsS3PackagesPath | アプリケーションのパッケージを保管する S3 のパス |
| awsRegion | AWS のリージョン ID |
| awsEc2InstanceType | EC2 のインスタンスタイプ |
| awsEc2ImageId | EC2 の AMI の ID （Ubuntu 18.04）|
| awsKeyName | EC2 のキーペア|

```json
//変更例
 "config": {
    "packageName": "tokyodigitaltwin",
    "stackName": "terria",
    "awsProfile": "terria",
    "awsS3PackagesPath": "s3://my-great-bucket/viewer",
    "awsRegion": "ap-northeast-1",
    "awsEc2InstanceType": "t3.small",
    "awsEc2ImageId": "ami-00bc9b7f0e98dc134",
    "awsKeyName": "my-great-key-pair",
```

### 1.2.5. TerriaMap/deploy/aws/stack.json の編集

`TerriaMap/deploy/aws/stack.json` の `Parameters.HostedZoneName.Default`と`SSLCertificateId`を編集します。

各項目の内容は次のとおりです。
| 項目名 | 内容 |
| :-- | :-- |
| Parameters.HostedZoneName.Default | Route53 の Hosted Zone |
| SSLCertificateId | AWS SSL Certificate の ARN |

### 1.2.6. nodejs 依存モジュールのインストール

```bash
yarn
```

### 1.2.7. インフラ構築とデプロイ

```bash
export NODE_OPTIONS=--max_old_space_size=4096
yarn deploy-without-reinstall
```
