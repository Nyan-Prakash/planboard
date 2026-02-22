"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ActivityContent } from "@/types";

interface ActivityDetailProps {
  content: ActivityContent;
}

export function ActivityDetail({ content }: ActivityDetailProps) {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">{content.overview}</p>
        </CardContent>
      </Card>

      {/* Research & Preparation */}
      <Card>
        <CardHeader>
          <CardTitle>Research & Preparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            {content.researchAndPreparation.description}
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            {content.researchAndPreparation.steps.map((step, i) => (
              <li key={i} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Format & Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Format & Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{content.format.description}</p>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Materials Needed:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {content.format.materials.map((material, i) => (
                <li key={i} className="text-gray-700">
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Structure / Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Structure</CardTitle>
          <p className="text-sm text-gray-500">
            Total Duration: {content.structure.duration}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.structure.phases.map((phase, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {phase.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">
                      {phase.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left font-semibold">
                    Criterion
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Weight</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.evaluation.criteria.map((criterion, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 font-medium">{criterion.name}</td>
                    <td className="px-4 py-2">{criterion.weight}%</td>
                    <td className="px-4 py-2 text-gray-700">
                      {criterion.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {content.evaluation.rubric && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Rubric:</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {content.evaluation.rubric}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reflection */}
      <Card>
        <CardHeader>
          <CardTitle>Reflection Survey</CardTitle>
          <p className="text-sm text-gray-500">
            Questions for students to reflect on their learning experience
          </p>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-3">
            {content.reflection.questions.map((question, i) => (
              <li key={i} className="text-gray-700">
                {question}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Resources */}
      {content.resources && content.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {content.resources.map((resource, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs capitalize shrink-0 mt-0.5"
                  >
                    {resource.type}
                  </Badge>
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {resource.title}
                      <span className="ml-1 text-xs text-gray-400">
                        &#8599;
                      </span>
                    </a>
                  ) : (
                    <span className="text-gray-700">{resource.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Adaptations */}
      <Card>
        <CardHeader>
          <CardTitle>Differentiation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              For Advanced Students:
            </h4>
            <p className="text-gray-700">{content.adaptations.higherLevel}</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              For Students Needing Support:
            </h4>
            <p className="text-gray-700">{content.adaptations.lowerLevel}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
