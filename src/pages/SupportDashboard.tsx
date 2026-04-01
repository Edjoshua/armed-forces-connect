import { useState } from "react";
import { MessageSquare, HelpCircle, ChevronDown, ChevronUp, Send, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings > Security and click 'Change Password'. You can also use the forgot password link on the login page." },
  { q: "How do I scan a QR code to pay?", a: "Navigate to Payments > Scan tab, then point your camera at the merchant's QR code. You can also enter the merchant code manually." },
  { q: "How does the NFC tap-to-pay work?", a: "Go to Payments > NFC tab, set your payment amount, and hold your phone near the merchant's payment terminal." },
  { q: "How do I check my retail discount benefits?", a: "Visit the Retail Discounts section from the sidebar to see available partner discounts and your transaction history." },
  { q: "What should I do if a transaction fails?", a: "Check your balance and internet connection. If the issue persists, submit a support ticket and we'll resolve it within 24 hours." },
  { q: "How do I update my profile information?", a: "Go to Settings and update your personal details. Changes will be reflected across all services." },
];

const existingTickets = [
  { id: "TKT-0451", subject: "Transaction pending for 48 hours", status: "Open", date: "Mar 30, 2026" },
  { id: "TKT-0389", subject: "Discount not applied at checkout", status: "Resolved", date: "Mar 22, 2026" },
];

const SupportDashboard = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  const handleSubmitTicket = () => {
    if (!subject || !message || !category) {
      toast({ title: "Incomplete form", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Ticket Submitted", description: `Your ticket has been submitted. We'll respond within 24 hours.` });
    setSubject("");
    setMessage("");
    setCategory("");
  };

  return (
    <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Support</h1>
        <p className="text-sm text-muted-foreground">Get help, submit tickets, and find answers</p>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><Phone className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Hotline</p>
              <p className="text-sm font-medium text-foreground">0800-MWCIP-00</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><Mail className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">support@mwcip.mil.ng</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><Clock className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Response Time</p>
              <p className="text-sm font-medium text-foreground">Within 24 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Ticket */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Submit a Ticket</CardTitle>
            <CardDescription>Describe your issue and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="account">Account Problem</SelectItem>
                  <SelectItem value="discount">Discount / Benefits</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Input placeholder="Brief description of your issue" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Message</Label>
              <Textarea placeholder="Describe your issue in detail..." value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[120px] bg-secondary/50 border-border/50" />
            </div>
            <Button variant="gold" className="w-full" onClick={handleSubmitTicket}>
              <Send className="h-4 w-4" /> Submit Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Existing Tickets */}
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y divide-border/30">
              {existingTickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.subject}</p>
                    <p className="text-xs text-muted-foreground">{t.id} · {t.date}</p>
                  </div>
                  <Badge variant="outline" className={t.status === "Open" ? "border-warning/20 text-warning" : "border-success/20 text-success"}>
                    {t.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y divide-border/30">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    className="flex w-full items-center justify-between py-3 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <p className="text-sm font-medium text-foreground pr-4">{faq.q}</p>
                    {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-muted-foreground pb-3">{faq.a}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
