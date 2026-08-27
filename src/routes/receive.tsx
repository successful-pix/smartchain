import { createFileRoute } from "@tanstack/react-router";
import { TransactionForm } from "@/components/wallet/TransactionForm";
export const Route = createFileRoute("/receive")({ component: () => <TransactionForm type="receive" /> });
