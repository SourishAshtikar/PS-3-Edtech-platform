import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600">This page is currently a placeholder for the Manage Flashcards feature. More content will be added soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
