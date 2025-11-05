'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LogOut, Shirt, LayoutDashboard, Home, ShoppingCart, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser, useFirestore, useDoc } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';


function AdminGate({ children }: { children: React.ReactNode; }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const adminRoleRef = useMemoFirebase(
    () => (firestore && user?.uid ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user?.uid]
  );
  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);
  
  const isAdmin = adminRole !== null && adminRole !== undefined;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isAdminRoleLoading;
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background font-game relative">
        <div className="absolute inset-0 scanlines z-0" />
        <div className="text-center p-8 bg-black/50 border-2 border-primary/30 rounded-lg z-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
     return (
       <div className="flex min-h-screen w-full items-center justify-center bg-background font-game relative">
          <div className="absolute inset-0 scanlines z-0" />
          <div className="text-center p-8 bg-black/50 border-2 border-destructive/50 rounded-lg z-10 max-w-sm">
              <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-4 text-lg font-bold text-destructive">Acesso Negado</h3>
              <p className="mt-2 text-sm text-muted-foreground">Você não tem permissão para acessar o painel de administração.</p>
              <p className="mt-1 text-xs text-muted-foreground">Faça login com uma conta de administrador ou contate o suporte.</p>
          </div>
      </div>
    );
  }

  return <>{children}</>;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push('/admin/login');
    });
  };

  // Se estiver na página de login, não renderize o layout do admin,
  // pois isso criaria um loop de verificação.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // O AdminGate agora controla o acesso e a tela de carregamento.
  return (
    <AdminGate>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold text-primary">Admin</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/products">
                    <Shirt />
                    Produtos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/orders">
                    <ShoppingCart />
                    Pedidos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                      <Link href="/">
                          <Home />
                          <span>Ir para a loja</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut />
                  Sair
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="p-4 flex items-center gap-4">
              <SidebarTrigger className="md:hidden"/>
              <h1 className="text-xl font-semibold text-primary">Painel</h1>
          </header>
          <main className="p-4">
              {children}
          </main>
          </SidebarInset>
      </SidebarProvider>
    </AdminGate>
  );
}
