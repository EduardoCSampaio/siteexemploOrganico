
import { Suspense } from 'react';
import { LoginPageClient } from './client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedHeader } from '@/components/AnimatedHeader';

function LoginSkeleton() {
  return (
    <div className="container py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <AnimatedHeader text="Login" />
            </div>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Bem-vindo de volta!</CardTitle>
                    <CardDescription>
                    Faça login para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-48" />
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginPageClient />
    </Suspense>
  );
}
