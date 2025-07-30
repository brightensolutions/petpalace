import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getUser(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ViewUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  if (!user) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="border p-4 rounded shadow bg-white">
        <p>
          <strong>ID:</strong> {user._id}
        </p>
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Number:</strong> {user.number}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
      <Link href="/users" className="mt-4 inline-block text-blue-600 underline">
        ← Back to Users
      </Link>
    </div>
  );
}
