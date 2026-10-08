import { serializeStructuredData } from "./structuredData.mjs";

export default function StructuredData({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }} />;
}
