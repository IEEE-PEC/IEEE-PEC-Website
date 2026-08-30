import Head from "next/head";

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export default function PageHead({
  title = "IEEE PEC Student Branch | Punjab Engineering College",
  description = "Official website of IEEE Student Branch at Punjab Engineering College, Chandigarh. Discover our IEEE CS, RAS, PES, WIE, and CAS chapters, student projects, hardware inventory, and events.",
  keywords = "IEEE, PEC, Punjab Engineering College, IEEE Student Branch, Robotics, Computer Society, PES, WIE, Hardware, Engineering, Hackathons, Chandigarh",
  image = "/hero-og.png",
}: PageHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.png" />

      {/* OpenGraph / Social */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
