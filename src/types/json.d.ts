declare module "*.json" {
  const value: {
    title: string
    content: Array<{
      대제목: string
      중제목: string
      소제목: string
      verse: string
      text: string
    }>
  }
  export default value
} 