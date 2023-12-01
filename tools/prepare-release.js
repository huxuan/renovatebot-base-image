import { Command, Option, runExit } from 'clipanion';
import shell from 'shelljs';

class PrepareCommand extends Command {
  release = Option.String('-r,--release', { required: true });
  gitSha = Option.String('--sha');
  dryRun = Option.Boolean('-d,--dry-run');

  async execute() {
    /** @type {shell.ShellString} */
    let r;
    const { release, gitSha, dryRun } = this;

    shell.echo(`Preparing version: ${release} (${gitSha})`);

    if (dryRun) {
      shell.echo('DRY-RUN: done.');
      return 0;
    }

    process.env.TAG = release;
    process.env.BASE_IMAGE_VERSION = release;

    r = shell.exec(
      'docker buildx bake --set settings.platform=linux/amd64,linux/arm64',
    );
    if (r.code) {
      return 1;
    }

    return 0;
  }
}

void runExit(PrepareCommand);
