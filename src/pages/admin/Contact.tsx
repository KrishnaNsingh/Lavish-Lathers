import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import { contactApi } from "../../api/contactApi";

export default function AdminContact() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "contact-messages"],
    queryFn: contactApi.getMessages,
    refetchOnMount: "always",
    gcTime: 0,
  });

  return (
    <AdminLayout title="Contact Form" subtitle="Customer inquiries, newest first.">
      {isLoading && <p role="status">Loading inquiries...</p>}
      {isError && <p role="alert">Unable to load inquiries. <button className="text-brand-gold underline" onClick={() => refetch()}>Retry</button></p>}
      {data?.length === 0 && <p>No inquiries yet.</p>}
      <div className="space-y-4">
        {data?.map((entry) => (
          <article key={entry._id} className="rounded-xl border border-brand-cream/10 p-5 space-y-2 break-words">
            <h2 className="font-serif-playfair text-xl">{entry.subject}</h2>
            <p className="text-sm">{entry.name} | {entry.email}{entry.phone && ` | ${entry.phone}`}</p>
            <p className="whitespace-pre-wrap text-sm">{entry.message}</p>
            <p className="text-xs text-brand-cream/65">Ticket {entry._id} | {new Date(entry.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
