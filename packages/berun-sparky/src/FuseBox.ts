type WorkFlowContext = any

/**
 * Interface for a FuseBox plugin
 */
export interface Plugin {
  test?: RegExp
  options?: any
  init?(context: WorkFlowContext): any
  transform?(file: File, ast?: any): any
  transformGroup?(file: File): any
  onTypescriptTransform?(file: File): any
  bundleStart?(context: WorkFlowContext): any
  bundleEnd?(context: WorkFlowContext): any
  producerEnd?(producer: any): any
  onSparky?(): any
  /**
   * If provided then the dependencies are loaded on the client
   *  before the plugin is invoked
   */
  dependencies?: string[]
}
