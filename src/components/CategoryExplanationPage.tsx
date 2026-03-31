import Link from "next/link";
import { categoryExplanations } from "@/lib/category-explanations";

type CategoryExplanationPageProps = Readonly<{
  categoryKey: string;
}>;

export default function CategoryExplanationPage({ categoryKey }: CategoryExplanationPageProps) {
  const content = categoryExplanations[categoryKey];

  if (!content) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Category not found</h1>
        <p className="mt-3 text-gray-600">This category page is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>

        <div className="mt-8 space-y-8">
          <article>
            <h2 className="text-xl font-semibold text-gray-900">What is this data category?</h2>
            <p className="mt-2 leading-7 text-gray-700">{content.whatItIs}</p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-gray-900">Why is it important?</h2>
            <p className="mt-2 leading-7 text-gray-700">{content.whyImportant}</p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-gray-900">Benefits for manufacturers</h2>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-gray-700">
              {content.benefitsForManufacturer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-gray-900">Benefits for product consumers</h2>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-gray-700">
              {content.benefitsForConsumer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-cyan-200 bg-cyan-50 p-8">
        <h2 className="text-xl font-semibold text-cyan-900">Take the next step</h2>
        <p className="mt-2 text-cyan-800">
          Start building your DPP workflow by adding products, registering passports, and viewing generated DPP records.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/add-product"
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
          >
            Add product
          </Link>
          <Link
            href="/add-dpp"
            className="inline-flex items-center rounded-lg border border-cyan-700 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
          >
            Register DPP
          </Link>
          <Link
            href="/dpp"
            className="inline-flex items-center rounded-lg border border-cyan-700 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
          >
            View DPP
          </Link>
        </div>
      </section>
    </main>
  );
}
