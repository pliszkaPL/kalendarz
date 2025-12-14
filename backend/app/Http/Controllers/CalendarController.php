<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\CalendarEntry;
use App\Models\CalendarGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CalendarController extends Controller
{
    /**
     * Synchronize calendar entries and groups from frontend to backend
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function sync(Request $request): JsonResponse
    {
        // Log incoming request for debugging
        Log::info('Calendar sync request', [
            'entries_count' => count($request->input('entries', [])),
            'groups_count' => count($request->input('groups', [])),
        ]);
        
        $validator = Validator::make($request->all(), [
            'entries' => 'required|array',
            'entries.*.id' => 'required|string|uuid',
            'entries.*.name' => 'required|string|max:255',
            'entries.*.date' => 'required|date_format:Y-m-d',
            'entries.*.icon' => 'nullable|string|max:10',
            'entries.*.backgroundColor' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'entries.*.textColor' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'entries.*.templateId' => 'nullable|string|uuid',
            'entries.*.groupId' => 'nullable|string|uuid',
            'entries.*.tags' => 'nullable|array',
            'entries.*.description' => 'nullable|string',
            'entries.*.recurrence' => 'nullable|array',
            'entries.*.customData' => 'nullable|array',
            'entries.*.isArchived' => 'nullable|boolean',
            
            'groups' => 'required|array',
            'groups.*.id' => 'required|string|uuid',
            'groups.*.name' => 'required|string|max:255',
            'groups.*.color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'groups.*.tags' => 'nullable|array',
            'groups.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Calendar sync validation failed', [
                'errors' => $validator->errors()->toArray(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Błąd walidacji danych',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        
        DB::beginTransaction();
        
        try {
            // Delete old data
            $user->calendarEntries()->delete();
            $user->calendarGroups()->delete();
            
            // Insert groups
            $groupsData = collect($request->input('groups', []))->map(function ($group) use ($user) {
                return [
                    'id' => $group['id'],
                    'user_id' => $user->id,
                    'name' => $group['name'],
                    'color' => $group['color'],
                    'tags' => json_encode($group['tags'] ?? []),
                    'description' => $group['description'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            });
            
            if ($groupsData->isNotEmpty()) {
                DB::table('calendar_groups')->insert($groupsData->toArray());
            }
            
            // Insert entries
            $entriesData = collect($request->input('entries', []))->map(function ($entry) use ($user) {
                return [
                    'id' => $entry['id'],
                    'user_id' => $user->id,
                    'name' => $entry['name'],
                    'date' => $entry['date'],
                    'icon' => $entry['icon'] ?? null,
                    'background_color' => $entry['backgroundColor'],
                    'text_color' => $entry['textColor'],
                    'template_id' => $entry['templateId'] ?? null,
                    'group_id' => $entry['groupId'] ?? null,
                    'tags' => json_encode($entry['tags'] ?? []),
                    'description' => $entry['description'] ?? null,
                    'recurrence' => isset($entry['recurrence']) ? json_encode($entry['recurrence']) : null,
                    'custom_data' => isset($entry['customData']) ? json_encode($entry['customData']) : null,
                    'is_archived' => $entry['isArchived'] ?? false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            });
            
            if ($entriesData->isNotEmpty()) {
                DB::table('calendar_entries')->insert($entriesData->toArray());
            }
            
            DB::commit();
            
            $entriesCount = $user->calendarEntries()->count();
            $groupsCount = $user->calendarGroups()->count();
            
            Log::info('Calendar sync successful', [
                'entries_count' => $entriesCount,
                'groups_count' => $groupsCount,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => "Zsynchronizowano {$entriesCount} wpisów i {$groupsCount} grup",
                'entries_count' => $entriesCount,
                'groups_count' => $groupsCount,
                'saved_at' => now()->toIso8601String(),
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Calendar sync failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas synchronizacji: ' . $e->getMessage(),
            ], 500);
        }
    }
}
