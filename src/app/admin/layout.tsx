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
import { LogOut, Shirt, LayoutDashboard, Home, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se o usuário não estiver carregando e não houver usuário, redirecione para a página de login
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router]);


  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push('/admin/login');
    });
  };

  const renderLoadingScreen = () => (
     <div className="flex min-h-screen w-full items-center justify-center bg-background font-game relative">
        <div className="absolute inset-0 scanlines z-0" />
        <div className="text-center p-8 bg-black/50 border-2 border-primary/30 rounded-lg z-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Verificando sessão de admin...</p>
        </div>
    </div>
  )

  // Se estiver na página de login, não renderize o layout do admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Não renderiza nada do layout principal até que o usuário seja verificado.
  if (isUserLoading || !user) {
     return renderLoadingScreen();
  }

  // Se o usuário estiver carregado e existir, renderiza o layout completo.
  return (
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
            {/* O conteúdo da página (children) só será renderizado quando o usuário estiver carregado */}
            {children}
        </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
