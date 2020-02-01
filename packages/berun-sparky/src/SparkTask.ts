export class SparkTask {
  public parallelDependencies: string[] = []

  public waterfallDependencies: string[] = []

  public help = ''

  constructor(public name: string, dependencies: string[], public fn: any) {
    this.addDependencies(dependencies)
  }

  addDependencies(dependencies: string[]) {
    dependencies.forEach(dependency => {
      if (dependency.charAt(0) === '&') {
        dependency = dependency.slice(1)
        if (this.parallelDependencies.indexOf(dependency) === -1) {
          this.parallelDependencies.push(dependency)
        }
      } else if (this.waterfallDependencies.indexOf(dependency) === -1) {
        this.waterfallDependencies.push(dependency)
      }
    })
  }
}
