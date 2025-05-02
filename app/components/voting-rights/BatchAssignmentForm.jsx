import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  electionId: z.string().min(1, "Election is required"),
  facultyId: z.string().optional(),
  majorId: z.string().optional(),
  year: z.string().optional(),
}).refine((data) => {
  // At least one filter criterion must be provided
  return data.facultyId || data.majorId || data.year;
}, {
  message: "At least one filter criterion (faculty, major, or year) is required",
  path: ["facultyId"], // This will show the error under the faculty field
});

export default function BatchAssignmentForm({ onSuccess }) {
  const [elections, setElections] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      electionId: "",
      facultyId: "",
      majorId: "",
      year: "",
    },
  });

  useEffect(() => {
    // Fetch elections
    fetch("/api/elections")
      .then((res) => res.json())
      .then((data) => setElections(data))
      .catch((error) => console.error("Error fetching elections:", error));

    // Fetch faculties
    fetch("/api/faculties")
      .then((res) => res.json())
      .then((data) => setFaculties(data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, []);

  // Fetch majors when faculty is selected
  useEffect(() => {
    const facultyId = form.watch("facultyId");
    if (facultyId) {
      fetch(`/api/faculties/${facultyId}/majors`)
        .then((res) => res.json())
        .then((data) => setMajors(data))
        .catch((error) => console.error("Error fetching majors:", error));
    } else {
      setMajors([]);
    }
  }, [form.watch("facultyId")]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/voting-rights/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to assign voting rights");
      }

      toast.success(result.message);
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="electionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Election</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {elections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facultyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="majorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a major" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.id} value={major.id}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter year"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Assigning..." : "Assign Voting Rights"}
        </Button>
      </form>
    </Form>
  );
} 