class Club {
  final String? clubId;
  final String? name;
  final String? description;
  final String? room;
  final String? adminId;
  final String? chatroomId;
  final String? status;
  final String? universityId;
  final DateTime? createdAt;
  final bool? hasUserMadeRequest;

  Club({
    this.clubId,
    this.name,
    this.description,
    this.room,
    this.adminId,
    this.chatroomId,
    this.status,
    this.universityId,
    this.createdAt,
    this.hasUserMadeRequest,
  });

  factory Club.fromJson(Map<String, dynamic> json) {
    return Club(
      clubId: json['clubid']?.toString() ?? json['clubId']?.toString(),
      name: json['name'],
      description: json['description'],
      room: json['room'],
      adminId: json['adminid']?.toString() ?? json['adminId']?.toString(),
      chatroomId:
          json['chatroomid']?.toString() ?? json['chatroomId']?.toString(),
      status: json['status'],
      universityId:
          json['universityid']?.toString() ?? json['universityId']?.toString(),
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      hasUserMadeRequest:
          json['hasUserMadeRequest'] == true ||
          json['hasusermaderequest'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'clubId': clubId,
      'name': name,
      'description': description,
      'room': room,
      'adminId': adminId,
      'chatroomId': chatroomId,
      'status': status,
      'universityId': universityId,
      'created_at': createdAt?.toIso8601String(),
      'hasUserMadeRequest': hasUserMadeRequest,
    };
  }
}
