import { useState } from "react";
import { QrCode, Smartphone, Send, Store, Building2, ArrowRight, CheckCircle2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MilitaryBarcodeCard from "@/components/MilitaryBarcodeCard";

const savedMerchants = [
  { name: "ShopRite Abuja", category: "Retail", icon: Store, discount: "15%" },
  { name: "MedPlus Pharmacy", category: "Health", icon: Building2, discount: "20%" },
  { name: "SPAR Kaduna", category: "Retail", icon: Store, discount: "10%" },
  { name: "Total Energies", category: "Fuel", icon: Building2, discount: "8%" },
];

const PaymentsDashboard = () => {
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [merchantAmount, setMerchantAmount] = useState("");
  const [barcodeAmount, setBarcodeAmount] = useState("");
  const [militaryDiscount, setMilitaryDiscount] = useState(20);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  const handleTransfer = () => {
    if (!transferAmount || !recipientAccount) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setPaymentSuccess(true);
    toast({ title: "Transfer Successful", description: `₦${Number(transferAmount).toLocaleString()} sent to ${recipientName || recipientAccount}` });
    setTimeout(() => {
      setPaymentSuccess(false);
      setTransferAmount("");
      setRecipientAccount("");
      setRecipientName("");
    }, 3000);
  };

  const handleMerchantPay = (merchant: string) => {
    if (!merchantAmount) {
      toast({ title: "Enter amount", description: "Please enter the payment amount", variant: "destructive" });
      return;
    }
    toast({ title: "Payment Successful", description: `₦${Number(merchantAmount).toLocaleString()} paid to ${merchant}` });
    setMerchantAmount("");
  };

  const handleBarcodePay = () => {
    if (!barcodeAmount) {
      toast({ title: "Enter amount", description: "Please enter the payment amount", variant: "destructive" });
      return;
    }
    const amount = Number(barcodeAmount);
    const discountPct = militaryDiscount / 100;
    const discounted = amount - amount * discountPct;
    toast({
      title: "Barcode Payment with Military Discount!",
      description: `Original: ₦${amount.toLocaleString()} → Discounted: ₦${discounted.toLocaleString()} (${militaryDiscount}% off)`,
    });
    setBarcodeAmount("");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground">Send money, scan to pay, or tap to pay with NFC</p>
      </div>

      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="scan" className="text-xs"><QrCode className="h-3.5 w-3.5 mr-1" /> QR Code</TabsTrigger>
          <TabsTrigger value="nfc" className="text-xs"><Smartphone className="h-3.5 w-3.5 mr-1" /> NFC</TabsTrigger>
          <TabsTrigger value="transfer" className="text-xs"><Send className="h-3.5 w-3.5 mr-1" /> Transfer</TabsTrigger>
          <TabsTrigger value="merchant" className="text-xs"><Store className="h-3.5 w-3.5 mr-1" /> Merchant</TabsTrigger>
        </TabsList>

        {/* Barcode Military ID Tab */}
        <TabsContent value="scan">
          <div className="space-y-4">
            <MilitaryBarcodeCard onDiscountReady={(d) => setMilitaryDiscount(d)} />

            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Barcode className="h-5 w-5 text-primary" /> Pay with Military Barcode
                </CardTitle>
                <CardDescription>
                  Present your barcode at checkout — your rank-based discount is applied automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Payment Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={barcodeAmount}
                    onChange={(e) => setBarcodeAmount(e.target.value)}
                    className="text-center text-lg font-mono bg-secondary/50 border-border/50"
                  />
                </div>

                {barcodeAmount && Number(barcodeAmount) > 0 && (
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 text-center space-y-1">
                    <p className="text-xs text-muted-foreground">After {militaryDiscount}% military discount</p>
                    <p className="text-xl font-bold text-primary">
                      ₦{(Number(barcodeAmount) * (1 - militaryDiscount / 100)).toLocaleString()}
                    </p>
                  </div>
                )}

                <Button variant="gold" className="w-full" onClick={handleBarcodePay}>
                  <Tag className="h-4 w-4" /> Pay with {militaryDiscount}% Discount
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NFC Tab */}
        <TabsContent value="nfc">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> NFC Tap to Pay</CardTitle>
              <CardDescription>Hold your device near a payment terminal to pay</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 py-8">
              <div className="w-40 h-40 rounded-full border-4 border-primary/20 bg-primary/5 flex items-center justify-center animate-pulse">
                <Smartphone className="h-16 w-16 text-primary/60" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-foreground">Ready to Tap</p>
                <p className="text-sm text-muted-foreground">Hold your phone near the payment terminal</p>
              </div>
              <div className="w-full max-w-xs space-y-3">
                <Label className="text-xs">Set payment amount</Label>
                <Input type="number" placeholder="₦0.00" className="text-center text-lg font-mono bg-secondary/50 border-border/50" />
                <Button variant="gold" className="w-full" onClick={() => toast({ title: "NFC Ready", description: "Demo mode — hold phone near terminal" })}>
                  Activate NFC Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Transfer Tab */}
        <TabsContent value="transfer">
          <Card className="border-border/50 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Send Money</CardTitle>
              <CardDescription>Transfer money to any account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentSuccess ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <CheckCircle2 className="h-16 w-16 text-success" />
                  <p className="text-lg font-semibold text-foreground">Transfer Successful!</p>
                  <p className="text-sm text-muted-foreground">₦{Number(transferAmount).toLocaleString()} sent</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs">Recipient Account Number</Label>
                    <Input placeholder="Enter account number" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Recipient Name</Label>
                    <Input placeholder="Enter recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Amount (₦)</Label>
                    <Input type="number" placeholder="0.00" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="text-lg font-mono bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Narration (optional)</Label>
                    <Input placeholder="What's this for?" className="bg-secondary/50 border-border/50" />
                  </div>
                  <Button variant="gold" className="w-full" onClick={handleTransfer}>
                    Send ₦{transferAmount ? Number(transferAmount).toLocaleString() : "0"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Merchant Payment Tab */}
        <TabsContent value="merchant">
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Store className="h-5 w-5 text-primary" /> Pay Merchant / Business</CardTitle>
                <CardDescription>Pay directly to partner merchants and businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Payment Amount (₦)</Label>
                  <Input type="number" placeholder="0.00" value={merchantAmount} onChange={(e) => setMerchantAmount(e.target.value)} className="text-lg font-mono bg-secondary/50 border-border/50" />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 grid-cols-2">
              {savedMerchants.map((m) => (
                <Card key={m.name} className="border-border/50 bg-card/80 hover:border-primary/20 transition-all cursor-pointer" onClick={() => handleMerchantPay(m.name)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <m.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">{m.category}</Badge>
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">{m.discount} off</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsDashboard;
