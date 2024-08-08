export default async function sleep(m: number) {
  await new Promise((r) => setTimeout(r, m));
}
