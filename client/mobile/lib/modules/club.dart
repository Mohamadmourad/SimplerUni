class Club {
  String? clubId;
  String? name;
  String? description;
  String? room;
  String? adminId;
  String? chatroomId;
  String? status;
  String? universityId;
  DateTime? createdAt;

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
    };
  }
}
