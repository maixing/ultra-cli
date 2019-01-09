#!/usr/bin/env node

const clone = require("git-clone-promise");
const semver = require("semver");
const program = require("commander");
const shell = require("shelljs");
const chalk = require("chalk");
const path = require("path");
const requiredVersion = require("../package.json").engines.node;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "您的Node版本是：" +
          process.version +
          ", 该" +
          id +
          "需要的Node版本为" +
          wanted +
          ".\n请更新你的Node版本."
      )
    );
    process.exit(1);
  }
}
checkNodeVersion(requiredVersion, "ultra-cli");
if (!shell.which("git")) {
  console.log(chalk.red(`您的系统没有配置git环境变量，请先配置git环境变量!`));
  process.exit(1);
}
program
  .version("1.0.0")
  .command("create [projectName]")
  .alias("c")
  .description("构建ultra-react模板项目")
  .action(function(projectName = "ultra-react-demo", options) {
    let pwd = shell.pwd();
    let localpath = path.join(pwd.toString(), projectName);
    console.log(chalk.green(`正在创建工程………………`));
    shell.rm('-rf', localpath);
    clone(`git@github.com:maixing/ultra-react.git`, localpath).then(res => {
      shell.rm("-rf", path.join(localpath, ".git"));
      shell.cd(projectName);
      console.log(chalk.green(`工程创建完毕………………`));
      console.log(chalk.green(`开始安装依赖包,可能需要几分钟，请耐心等待………………`));
      shell.exec('npm install --registry=https://registry.npm.taobao.org');
      console.log(chalk.green(`依赖包安装完毕!`));
      console.log(chalk.blue(`请参考${projectName}/README.md，进行项目开发`));
    });
  })

program.parse(process.argv);
