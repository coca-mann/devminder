
import { MessageSquare } from 'lucide-react';
import { feedbacks } from '@/lib/data';
import FeedbackList from '@/components/feedback/feedback-list';

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todo o feedback recebido dos projetos.
          </p>
        </div>
      </div>
      <FeedbackList initialFeedbacks={feedbacks} />
    </div>
  );
}
