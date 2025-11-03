import { StyleAdvisorClient } from './client';

export default function StyleAdvisorPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">AI Style Advisor</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your personal fashion assistant. Get instant outfit ideas and style recommendations tailored just for you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <StyleAdvisorClient />
      </div>
    </div>
  );
}
