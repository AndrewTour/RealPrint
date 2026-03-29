import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Active Campaigns</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{campaigns?.filter((c: any) => c.status !== 'COMPLETED' && c.status !== 'CANCELLED').length || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Drops (YTD)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{campaigns?.reduce((acc: number, c: any) => acc + (c.printQuantity || 0), 0).toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{campaigns?.filter((c: any) => c.status === 'PENDING_APPROVAL').length || 0}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>In-Home Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((campaign: any) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell>{campaign.type.replace('_', ' ')}</TableCell>
                  <TableCell>{campaign.agent?.name}</TableCell>
                  <TableCell>{campaign.printQuantity?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={campaign.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {campaign.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.inHomeDate ? format(new Date(campaign.inHomeDate), 'MMM d, yyyy') : 'TBD'}</TableCell>
                </TableRow>
              ))}
              {campaigns?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">No campaigns found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
