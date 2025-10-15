export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="h-12 w-96 bg-orange-400 rounded animate-pulse mb-4" />
            <div className="h-6 w-full max-w-2xl bg-orange-400 rounded animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                <div className="w-full h-56 bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
