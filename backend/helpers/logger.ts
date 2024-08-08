import chalk from "chalk";
import Config from "../../config";

export default class Logger {
  static log(message: string) {
    console.log(chalk.greenBright("[ > ]"), chalk.green(message));
  }

  static error(message: string) {
    console.log(chalk.redBright("[ x ]"), chalk.red(message));
  }

  static warning(message: string) {
    console.log(chalk.yellowBright("[ ! ]"), chalk.yellow(message));
  }

  static debug(message: string) {
    if (!Config.debug) return;
    console.log(chalk.gray(`[ DEBUG ]`), chalk.green(message));
  }
}
