export declare type ServerOptions = SecureContextOptions &
  TlsOptions &
  HttpServerOptions
export interface SecureContextOptions {
  pfx?: string | Buffer | Array<string | Buffer | Record<string, any>>
  key?: string | Buffer | Array<Buffer | Record<string, any>>
  passphrase?: string
  cert?: string | Buffer | Array<string | Buffer>
  ca?: string | Buffer | Array<string | Buffer>
  ciphers?: string
  honorCipherOrder?: boolean
  ecdhCurve?: string
  clientCertEngine?: string
  crl?: string | Buffer | Array<string | Buffer>
  dhparam?: string | Buffer
  secureOptions?: number
  secureProtocol?: string
  sessionIdContext?: string
}
interface SecureContext {
  context: any
}
interface TlsOptions extends SecureContextOptions {
  handshakeTimeout?: number
  requestCert?: boolean
  rejectUnauthorized?: boolean
  NPNProtocols?: string[] | Buffer[] | Uint8Array[] | Buffer | Uint8Array
  ALPNProtocols?: string[] | Buffer[] | Uint8Array[] | Buffer | Uint8Array
  SNICallback?: (
    servername: string,
    cb: (err: Error | null, ctx: SecureContext) => void
  ) => void
  sessionTimeout?: number
  ticketKeys?: Buffer
}
interface HttpServerOptions {
  IncomingMessage?: any
  ServerResponse?: any
}
export {}
