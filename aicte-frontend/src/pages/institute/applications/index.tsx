"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  FileText,
  Plus,
  Filter,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInstituteStore } from "@/hooks/useInstituteData";
import { useApplicationGet } from "@/hooks/useApplication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  UniversityApplication,
} from "@/schemas/applicationSchema";
import applicationTypes from "@/data/applicationTypes.json";

const getApplicationStatus = (documents: UniversityApplication): string => {
  const approvedCount = documents.UniversityDocuments.filter(
    (doc) => doc.status != "NOT_SUBMITTED"
  ).length;
  if (approvedCount === documents.application.documents.length)
    return "Approved";
  if (approvedCount > 0) return "In Progress";
  return "Not Started";
};

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<UniversityApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    UniversityApplication[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { instituteId } = useInstituteStore();
  const { mutateAsync: getApplication } = useApplicationGet();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getApplication(instituteId as string);
      setApplications(data.data);
      setFilteredApplications(data.data);
    };
    fetchApplications();
  }, [getApplication, instituteId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, statusFilter, typeFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    const updatedStatusFilter = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    setStatusFilter(updatedStatusFilter);
    applyFilters(searchTerm, updatedStatusFilter, typeFilter);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    applyFilters(searchTerm, statusFilter, type);
  };

  const applyFilters = (search: string, statuses: string[], type: string) => {
    let result = applications;

    if (search) {
      result = result.filter((app) =>
        app.application.application_name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statuses.length > 0) {
      result = result.filter((app) =>
        statuses.includes(getApplicationStatus(app))
      );
    }

    if (type) {
      result = result.filter((app) => app.application.application_id === type);
    }

    setFilteredApplications(result);
  };

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(
    (app) => getApplicationStatus(app) === "Approved"
  ).length;
  const inProgressApplications = applications.filter(
    (app) => getApplicationStatus(app) === "In Progress"
  ).length;

  const chartData = [
    { name: "Mon", applications: 4 },
    { name: "Tue", applications: 3 },
    { name: "Wed", applications: 2 },
    { name: "Thu", applications: 6 },
    { name: "Fri", applications: 5 },
    { name: "Sat", applications: 3 },
    { name: "Sun", applications: 1 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#2c3e50]">
              Applications Dashboard
            </h1>
            <p className="text-[#7f8c8d] text-sm">
              Manage and monitor your institution's applications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] h-4 w-4" />
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 w-64 border-[#e0e0e0]"
              />
            </div>
            <Button size="icon" variant="ghost" className="text-[#7f8c8d]">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2c3e50]">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-[#3498db]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2c3e50]">
                {totalApplications}
              </div>
              <p className="text-xs text-[#7f8c8d]">+20% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2c3e50]">
                Approved Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-[#2ecc71]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2c3e50]">
                {approvedApplications}
              </div>
              <p className="text-xs text-[#7f8c8d]">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2c3e50]">
                In Progress Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-[#f39c12]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2c3e50]">
                {inProgressApplications}
              </div>
              <p className="text-xs text-[#7f8c8d]">+5% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#2c3e50]">
                Application Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#7f8c8d" />
                    <YAxis stroke="#7f8c8d" />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#2c3e50]">
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[200px]">
                {applications.length == 0 ? (
                  <div className="flex h-[200px] justify-center">
                    <div className="self-center font-semibold">
                      No Applications Submitted
                    </div>
                  </div>
                ) : (
                  applications.slice(0, 3).map((app) => (
                    <div
                      key={app.uni_application_id}
                      className="flex items-center space-x-4 mb-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none text-[#2c3e50]">
                          {app.application.application_name}
                        </p>
                        <p className="text-sm text-[#7f8c8d]">
                          {app.uni_application_id}
                        </p>
                      </div>
                      <Badge>
                        {getApplicationStatus(app)}
                      </Badge>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#2c3e50]">All Applications</CardTitle>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#e0e0e0] text-[#7f8c8d]"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-[#2c3e50]">
                        Status
                      </h4>
                      <div className="space-y-2">
                        {["Approved", "In Progress", "Not Started"].map(
                          (status) => (
                            <div key={status} className="flex items-center">
                              <Checkbox
                                id={`status-${status}`}
                                checked={statusFilter.includes(status)}
                                onCheckedChange={() =>
                                  handleStatusFilterChange(status)
                                }
                              />
                              <Label
                                htmlFor={`status-${status}`}
                                className="ml-2 text-sm text-[#2c3e50]"
                              >
                                {status}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-[#2c3e50]">Type</h4>
                      <Select
                        value={typeFilter}
                        onValueChange={handleTypeFilterChange}
                      >
                        <SelectTrigger className="border-[#e0e0e0]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {applicationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => navigate("/institute")}
                className="bg-[#3498db] hover:bg-[#2980b9] text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> New Application
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-auto">
              {filteredApplications.length == 0 ? (
                <div className="flex justify-center">
                  <div className="self-center font-semibold">
                    No Applications found
                  </div>
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div
                    key={app.uni_application_id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#e0e0e0]"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {app.application.application_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#2c3e50]">
                          {app.application.application_name}
                        </p>
                        <p className="text-sm text-[#7f8c8d]">
                          {app.createdOn == undefined
                            ? ""
                            : new Date(app.createdOn).toDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge>{getApplicationStatus(app)}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(
                            `/institute/applications/${app.uni_application_id}`
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ApplicationsPage;
